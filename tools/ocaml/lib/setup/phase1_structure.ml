(** Phase 1: Project Structure Verification
    This phase ensures that the MoneyWise project has all required directories and files
    before proceeding with further setup phases. This verification is critical because:

    1. Missing core directories (backend/frontend) would prevent proper application setup
    2. Missing setup scripts would break the automated installation process
    3. Missing configuration files would lead to runtime errors

    The verification checks for:
    - Core component directories (backend, frontend)
    - Essential setup and configuration files

    Note: Shell scripts are being migrated to OCaml, so we no longer check for
    the scripts directory or shell utilities.
*)


(** Result of checking a single path (file or directory) *)
type path_check_result = {
  path : string;           (** Path being checked *)
  description : string;    (** Human-readable description of the path *)
  exists : bool;          (** Whether the path exists *)
  error_message : string option; (** Error message if path doesn't exist *)
}

(** Overall structure verification status *)
type structure_status = {
  total_checks : int;      (** Total number of path checks performed *)
  passed_checks : int;     (** Number of checks that passed *)
  failed_checks : int;     (** Number of checks that failed *)
  results : path_check_result list; (** List of individual check results *)
}

(** Create an initial empty structure status *)
let create_empty_status () = {
  total_checks = 0;
  passed_checks = 0;
  failed_checks = 0;
  results = [];
}

(** Check a single path and return its result *)
let check_single_path root_dir path description exists_fn =
  let full_path = Filename.concat root_dir path in
  let exists = exists_fn full_path in
  let error_message = if not exists then
    Some (Printf.sprintf "%s not found at %s" description (Utils.format_path full_path))
  else
    None
  in
  {
    path = full_path;
    description;
    exists;
    error_message;
  }

(** Update structure status with a new check result *)
let update_status status check_result =
  {
    total_checks = status.total_checks + 1;
    passed_checks = status.passed_checks + (if check_result.exists then 1 else 0);
    failed_checks = status.failed_checks + (if check_result.exists then 0 else 1);
    results = check_result :: status.results;
  }

(** Display the results of structure verification *)
let display_structure_status status =
  Printf.printf "============================================\n";

  List.iter (fun result ->
    let icon = if result.exists then "✅" else "❌" in
    let error_str = match result.error_message with
      | Some msg -> Printf.sprintf " - %s" msg
      | None -> ""
    in
    Printf.printf "%s %s%s\n" icon result.description error_str
  ) (List.rev status.results);

  Printf.printf "\nSummary: %d/%d checks passed\n" status.passed_checks status.total_checks;

  if status.failed_checks = 0 then
    Printf.printf "✅ All structure checks passed successfully!\n"
  else
    Printf.printf "❌ Some required paths are missing. Please check the errors above.\n"

let verify_project_structure root_dir =
  Printf.printf "🔍 Phase 1: Project Structure Verification\n";
  Printf.printf "  Checking project structure in: %s\n" (Utils.format_path root_dir);

  let status = ref (create_empty_status ()) in

  (* Required directories and files that form the core project structure:
     - Backend: Contains the Rust server implementation and database management
     - Frontend: Contains the React Native mobile application *)
  (* Define required paths to check *)
  let required_paths = [
    ("moneywise-backend", "Backend directory", Utils.directory_exists);
    ("moneywise-app", "Frontend directory", Utils.directory_exists);
    ("moneywise-backend/setup.sh", "Backend setup script", Utils.file_exists);
    ("moneywise-app/package.json", "Frontend package configuration", Utils.file_exists);
  ] in

  (* Check all paths and update status *)
  List.iter (fun (path, desc, exists_fn) ->
    let check_result = check_single_path root_dir path desc exists_fn in
    status := update_status !status check_result
  ) required_paths;

  (* Display results *)
  display_structure_status !status;

  (* Convert to phase result for compatibility *)
    let final_result = {
    Types.phase_name = "Project Structure Verification";
    success = !status.failed_checks = 0;
    errors = List.filter_map (fun r -> r.error_message) !status.results;
    warnings = [];  (* No warnings in this phase *)
    details = List.filter_map (fun r ->
      if r.exists then Some (Printf.sprintf "%s exists" r.description) else None
    ) !status.results;
  } in

  final_result
