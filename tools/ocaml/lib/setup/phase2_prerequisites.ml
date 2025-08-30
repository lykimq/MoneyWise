(** Phase 2: Prerequisites Verification *)

open Types
open Results
open Errors

(** Prerequisite check result *)
type prerequisite_result =
  { name: string  (** Name of the prerequisite being checked *)
  ; is_available: bool
        (** Whether the prerequisite is available on the system *)
  ; version: string option  (** Version string if available, None otherwise *)
  ; path: string option  (** Path to the executable if found *)
  ; error_message: string option
        (** Error message if prerequisite is not available *) }

(** Overall prerequisites status *)
type prerequisites_status =
  { total_checks: int  (** Total number of prerequisite checks performed *)
  ; passed_checks: int  (** Number of checks that passed *)
  ; failed_checks: int  (** Number of checks that failed *)
  ; results: prerequisite_result list  (** List of individual check results *)
  }

(** Check if a command exists in PATH *)
let command_exists cmd =
  try
    let ic = Unix.open_process_in (Fmt.str "which %s" cmd) in
    let _ = input_line ic in
    let status = Unix.close_process_in ic in
    match status with Unix.WEXITED 0 -> true | _ -> false
  with _ -> false

(** Extract version from command output using pattern matching *)
let extract_version cmd args =
  try
    let cmd_str = Fmt.str "%s %s" cmd args in
    let ic = Unix.open_process_in cmd_str in
    let output = input_line ic in
    let _ = Unix.close_process_in ic in
    (* Simple regex-like pattern matching for version extraction *)
    let len = String.length output in
    let rec find_version start =
      if start >= len then None
      else if
        start + 2 < len
        && output.[start] = 'v'
        && output.[start + 1] >= '0'
        && output.[start + 1] <= '9'
      then Some (String.sub output start (len - start))
      else if start < len && output.[start] >= '0' && output.[start] <= '9' then
        Some (String.sub output start (len - start))
      else find_version (start + 1)
    in
    find_version 0
  with _ -> None

(** Check Rust/Cargo installation *)
let check_rust () =
  let name = "Rust/Cargo" in
  if not (command_exists "cargo") then
    { name
    ; is_available= false
    ; version= None
    ; path= None
    ; error_message=
        Some "Rust/Cargo not found. Install from https://rustup.rs/" }
  else
    let version = extract_version "cargo" "--version" in
    {name; is_available= true; version; path= None; error_message= None}

(** Check Node.js installation *)
let check_nodejs () =
  let name = "Node.js" in
  if not (command_exists "node") then
    { name
    ; is_available= false
    ; version= None
    ; path= None
    ; error_message= Some "Node.js not found. Install from https://nodejs.org/"
    }
  else
    let version = extract_version "node" "--version" in
    {name; is_available= true; version; path= None; error_message= None}

(** Check PostgreSQL installation *)
let check_postgresql () =
  let name = "PostgreSQL" in
  if not (command_exists "psql") then
    { name
    ; is_available= false
    ; version= None
    ; path= None
    ; error_message=
        Some
          "PostgreSQL not found. Install from https://postgresql.org/download/"
    }
  else
    let version = extract_version "psql" "--version" in
    {name; is_available= true; version; path= None; error_message= None}

(** Check Redis installation (optional) *)
let check_redis () =
  let name = "Redis" in
  if not (command_exists "redis-cli") then
    { name
    ; is_available= false
    ; version= None
    ; path= None
    ; error_message=
        Some "Redis not found. Install from https://redis.io/download/" }
  else
    let version = extract_version "redis-cli" "--version" in
    {name; is_available= true; version; path= None; error_message= None}

(** Check Git installation *)
let check_git () =
  let name = "Git" in
  if not (command_exists "git") then
    { name
    ; is_available= false
    ; version= None
    ; path= None
    ; error_message= Some "Git not found. Install from https://git-scm.com/" }
  else
    let version = extract_version "git" "--version" in
    {name; is_available= true; version; path= None; error_message= None}

(** Check curl installation *)
let check_curl () =
  let name = "curl" in
  if not (command_exists "curl") then
    { name
    ; is_available= false
    ; version= None
    ; path= None
    ; error_message= Some "curl not found. Install from https://curl.se/" }
  else {name; is_available= true; version= None; path= None; error_message= None}

(** Check all prerequisites and return status *)
let check_all_prerequisites () =
  let checks =
    [ check_rust ()
    ; check_nodejs ()
    ; check_postgresql ()
    ; check_git ()
    ; check_curl ()
    ; check_redis () ]
  in
  let total_checks = List.length checks in
  let passed_checks =
    List.length (List.filter (fun r -> r.is_available) checks)
  in
  let failed_checks = total_checks - passed_checks in
  {total_checks; passed_checks; failed_checks; results= checks}

(** Display prerequisites status with formatted output *)
let display_prerequisites_status status =
  Logs.info (fun m -> m "🔍 Checking MoneyWise project prerequisites...") ;
  Logs.info (fun m -> m "============================================") ;
  List.iter
    (fun result ->
      let icon = if result.is_available then "✅" else "❌" in
      let version_str =
        match result.version with
        | Some v ->
            Fmt.str " (version: %s)" v
        | None ->
            ""
      in
      let error_str =
        match result.error_message with
        | Some msg ->
            Fmt.str " - %s" msg
        | None ->
            ""
      in
      Logs.info (fun m -> m "%s %s%s%s" icon result.name version_str error_str) )
    status.results ;
  Logs.info (fun m -> m "") ;
  Logs.info (fun m ->
      m "Summary: %d/%d checks passed" status.passed_checks status.total_checks ) ;
  if status.failed_checks = 0 then
    Logs.info (fun m -> m "✅ All prerequisites verified successfully!")
  else
    Logs.info (fun m ->
        m "❌ Some prerequisites are missing. Please install them and try again." )

(** Verify all prerequisites are available *)
let verify_prerequisites () =
  Logs.info (fun m -> m "✅ Phase 2: Prerequisites Verification") ;
  let result = ref (initial_phase_result "Prerequisites Verification") in
  let prereq_status = check_all_prerequisites () in
  display_prerequisites_status prereq_status ;
  result :=
    add_detail !result
      (Fmt.str "%d/%d prerequisites verified" prereq_status.passed_checks
         prereq_status.total_checks ) ;
  if prereq_status.failed_checks = 0 then result := {!result with success= true}
  else (
    result := add_phase_error !result "Some prerequisites are missing" ;
    result := {!result with success= false} ) ;
  Logs.info (fun m ->
      m "  Phase 2 completed: %d/%d checks passed"
        (if !result.success then 1 else 0)
        1 ) ;
  !result
