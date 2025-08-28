(** Prerequisites checking module for MoneyWise tools *)

(** Prerequisite check result *)
type prerequisite_result = {
  name : string;        (** Name of the prerequisite being checked *)
  is_available : bool;  (** Whether the prerequisite is available on the system *)
  version : string option; (** Version string if available, None otherwise *)
  path : string option; (** Path to the executable if found *)
  error_message : string option; (** Error message if prerequisite is not available *)
}

(** Overall prerequisites status *)
type prerequisites_status = {
  total_checks : int;   (** Total number of prerequisite checks performed *)
  passed_checks : int;  (** Number of checks that passed *)
  failed_checks : int;  (** Number of checks that failed *)
  results : prerequisite_result list; (** List of individual check results *)
}

(** Check if a command exists in PATH
    @param cmd The command name to check
    @return true if the command exists and is executable, false otherwise *)
let command_exists cmd =
  try
    let ic = Unix.open_process_in (Printf.sprintf "which %s" cmd) in
    let _ = input_line ic in
    let status = Unix.close_process_in ic in
    match status with
    | Unix.WEXITED 0 -> true
    | _ -> false
  with _ -> false

(** Extract version from command output using pattern matching
    @param cmd The command to execute
    @param args The arguments to pass to the command
    @return Some version_string if a version pattern is found, None otherwise *)
let extract_version cmd args =
  try
    let cmd_str = Printf.sprintf "%s %s" cmd args in
    let ic = Unix.open_process_in cmd_str in
    let output = input_line ic in
    let _ = Unix.close_process_in ic in

    (* Simple regex-like pattern matching for version extraction *)
    let len = String.length output in
    let rec find_version start =
      if start >= len then None
      else if start + 2 < len &&
              output.[start] = 'v' &&
              output.[start + 1] >= '0' && output.[start + 1] <= '9' then
        Some (String.sub output start (len - start))
      else if start < len &&
              output.[start] >= '0' && output.[start] <= '9' then
        Some (String.sub output start (len - start))
      else
        find_version (start + 1)
    in
    find_version 0
  with _ -> None

(** Check Rust/Cargo installation
    @return prerequisite_result indicating Rust/Cargo availability and version *)
let check_rust () =
  let name = "Rust/Cargo" in
  if not (command_exists "cargo") then
    {
      name;
      is_available = false;
      version = None;
      path = None;
      error_message = Some "Rust/Cargo not found. Install from https://rustup.rs/";
    }
  else
    let version = extract_version "cargo" "--version" in
    {
      name;
      is_available = true;
      version;
      path = None;
      error_message = None;
    }

(** Check Node.js installation
    @return prerequisite_result indicating Node.js availability and version *)
let check_nodejs () =
  let name = "Node.js" in
  if not (command_exists "node") then
    {
      name;
      is_available = false;
      version = None;
      path = None;
      error_message = Some "Node.js not found. Install from https://nodejs.org/";
    }
  else
    let version = extract_version "node" "--version" in
    {
      name;
      is_available = true;
      version;
      path = None;
      error_message = None;
    }

(** Check PostgreSQL installation
    @return prerequisite_result indicating PostgreSQL availability and version *)
let check_postgresql () =
  let name = "PostgreSQL" in
  if not (command_exists "psql") then
    {
      name;
      is_available = false;
      version = None;
      path = None;
      error_message = Some "PostgreSQL not found. Install from https://postgresql.org/download/";
    }
  else
    let version = extract_version "psql" "--version" in
    {
      name;
      is_available = true;
      version;
      path = None;
      error_message = None;
    }

(** Check Redis installation (optional)
    @return prerequisite_result indicating Redis availability and version *)
let check_redis () =
  let name = "Redis" in
  if not (command_exists "redis-cli") then
    {
      name;
      is_available = false;
      version = None;
      path = None;
      error_message = Some "Redis not found. Install from https://redis.io/download/";
    }
  else
    let version = extract_version "redis-cli" "--version" in
    {
      name;
      is_available = true;
      version;
      path = None;
      error_message = None;
    }

(** Check Git installation
    @return prerequisite_result indicating Git availability and version *)
let check_git () =
  let name = "Git" in
  if not (command_exists "git") then
    {
      name;
      is_available = false;
      version = None;
      path = None;
      error_message = Some "Git not found. Install from https://git-scm.com/";
    }
  else
    let version = extract_version "git" "--version" in
    {
      name;
      is_available = true;
      version;
      path = None;
      error_message = None;
    }

(** Check curl installation
    @return prerequisite_result indicating curl availability *)
let check_curl () =
  let name = "curl" in
  if not (command_exists "curl") then
    {
      name;
      is_available = false;
      version = None;
      path = None;
      error_message = Some "curl not found. Install from https://curl.se/";
    }
  else
    {
      name;
      is_available = true;
      version = None;
      path = None;
      error_message = None;
    }

(** Check all prerequisites and return status
    @return prerequisites_status with results of all checks *)
let check_all_prerequisites () =
  let checks = [
    check_rust ();
    check_nodejs ();
    check_postgresql ();
    check_git ();
    check_curl ();
    check_redis ();
  ] in

  let total_checks = List.length checks in
  let passed_checks = List.length (List.filter (fun r -> r.is_available) checks) in
  let failed_checks = total_checks - passed_checks in

  {
    total_checks;
    passed_checks;
    failed_checks;
    results = checks;
  }

(** Display prerequisites status with formatted output *)
let display_prerequisites_status status =
  Printf.printf "🔍 Checking MoneyWise project prerequisites...\n";
  Printf.printf "============================================\n";

  List.iter (fun result ->
    let icon = if result.is_available then "✅" else "❌" in
    let version_str = match result.version with
      | Some v -> Printf.sprintf " (version: %s)" v
      | None -> ""
    in
    let error_str = match result.error_message with
      | Some msg -> Printf.sprintf " - %s" msg
      | None -> ""
    in
    Printf.printf "%s %s%s%s\n" icon result.name version_str error_str
  ) status.results;

  Printf.printf "\nSummary: %d/%d checks passed\n" status.passed_checks status.total_checks;

  if status.failed_checks = 0 then
    Printf.printf "✅ All prerequisites verified successfully!\n"
  else
    Printf.printf "❌ Some prerequisites are missing. Please install them and try again.\n"

(** Check prerequisites without displaying output - for use by other modules
    @return true if all prerequisites are available, false otherwise *)
let verify_prerequisites_silent () =
  let status = check_all_prerequisites () in
  status.failed_checks = 0
