(** - Step 2: Environment Parsing and Database Detection (depend on step 1)

    + Read the `.env` to understand about the database environment
    + Parse `.env` and get the `DATABASE_URL`
    + Detech database type: localhost, or supabase? *)

type database_type = Local | Supabase | Unknown

let database_type_to_string = function
  | Local -> "local"
  | Supabase -> "supabase"
  | Unknown -> "unknown"

(** Parse a single line from .env file *)
let parse_env_line line =
  let line = String.trim line in
  if String.length line = 0 || line.[0] = '#' then None
  else
    match String.index_opt line '=' with
    | Some idx ->
        let key = String.sub line 0 idx |> String.trim in
        let value =
          String.sub line (idx + 1) (String.length line - idx - 1)
          |> String.trim
        in
        Some (key, value)
    | None -> None

(** Read and parse the .env file, returning a key-value pairs *)
let read_env_file env_path =
  try
    let ic = open_in env_path in
    let rec read_lines acc =
      try
        let line = input_line ic in
        match parse_env_line line with
        | Some (key, value) -> read_lines ((key, value) :: acc)
        | None -> read_lines acc
      with End_of_file -> List.rev acc
    in
    let env_vars = read_lines [] in
    close_in ic;
    Ok env_vars
  with
  | Sys_error msg ->
      Logs.err (fun m -> m "Failed to read .env file: %s" msg);
      Error (Fmt.str "Failed to read .env file: %s" msg)
  | e ->
      Logs.err (fun m ->
          m "Failed to read .env file: %s" (Printexc.to_string e));
      Error (Fmt.str "Failed to read .env file: %s" (Printexc.to_string e))

(** Extract the database type from the .env file *)
let extract_database_type env_vars =
  try
    let _, url = List.find (fun (key, _) -> key = "DATABASE_URL") env_vars in
    Ok url
  with Not_found -> Error (Fmt.str "DATABASE_URL not found in .env file")

(** Custom string contain *)
let string_contains ~substring s =
  let rec aux i =
    if i + String.length substring > String.length s then false
    else if String.sub s i (String.length substring) = substring then true
    else aux (i + 1)
  in
  aux 0

(** Detect database type base on DATABASE_URL *)
let detect_database_type database_url =
  let url_lowercase = String.lowercase_ascii database_url in
  if
    string_contains ~substring:"localhost" url_lowercase
    || string_contains ~substring:"127.0.0.1" url_lowercase
  then Local
  else if
    string_contains ~substring:"supabase.com" url_lowercase
    || string_contains ~substring:"supabase.co" url_lowercase
  then Supabase
  else Unknown

let check backend_dir =
  let env_path = Filename.concat backend_dir ".env" in
  let initial_result =
    Results.initial_phase_result "Database Environment Verification"
  in

  Logs.info (fun m -> m "Step 2: Verifying database environment...");

  match read_env_file env_path with
  | Error msg ->
      Logs.err (fun m -> m "Failed to read .env file: %s" msg);
      Errors.add_phase_error initial_result msg
  | Ok env_vars -> (
      let result1 =
        Errors.add_detail initial_result
          (Fmt.str "Parsed %d environment variables" (List.length env_vars))
      in

      (* Extract DATABASE_URL using your helper *)
      match extract_database_type env_vars with
      | Error msg ->
          Logs.err (fun m -> m "DATABASE_URL not found: %s" msg);
          Errors.add_phase_error result1 msg
      | Ok database_url ->
          let result2 =
            Errors.add_detail result1 "DATABASE_URL found in environment"
          in

          (* Detect database type *)
          let db_type = detect_database_type database_url in
          let db_type_str = database_type_to_string db_type in
          let result3 =
            Errors.add_detail result2 (Fmt.str "Database type: %s" db_type_str)
          in

          (* Add informational details based on type *)
          let result4 =
            match db_type with
            | Local ->
                Errors.add_detail result3
                  "Local PostgreSQL service will be required"
            | Supabase ->
                Errors.add_detail result3 "Using remote Supabase connection"
            | Unknown ->
                Errors.add_phase_warning result3
                  "Unknown database type - manual configuration may be required"
          in

          (* Mark success *)
          { result4 with success = true })
