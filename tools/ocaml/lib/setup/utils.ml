(** Setup utilities for MoneyWise CLI *)

open Unix

(** Get the appropriate logging function for a given log level *)
let get_log_function level =
  match level with
  | Logs.App -> Logs.app
  | Logs.Info -> Logs.info
  | Logs.Warning -> Logs.warn
  | Logs.Error -> Logs.err
  | Logs.Debug -> Logs.debug

(** Get the string representation of a log level for display *)
let get_log_level_string level =
  match level with
  | Logs.App -> "APP"
  | Logs.Info -> "INFO"
  | Logs.Warning -> "WARN"
  | Logs.Error -> "ERROR"
  | Logs.Debug -> "DEBUG"

(** Log at the current log level set by the user *)
let log_at_current_level msg =
  match Logs.level () with
  | Some level ->
      let log_fn = get_log_function level in
      log_fn (fun m -> m "%s" msg)
  | None -> Logs.info (fun m -> m "%s" msg)
(* fallback *)

(** Check if file exists and is a regular file *)
let file_exists file_path =
  try
    let stats = stat file_path in
    stats.st_kind = S_REG
  with _ -> false

(** Check if directory exists and is a directory *)
let directory_exists dir_path =
  try
    let stats = stat dir_path in
    stats.st_kind = S_DIR
  with _ -> false

(** Make file executable (chmod 755) *)
let make_executable file_path =
  try
    chmod file_path 0o755;
    true
  with _ -> false

(** Execute shell command in directory *)
let execute_command_in_dir dir command =
  let full_command = "cd " ^ dir ^ " && " ^ command in
  try Sys.command full_command
  with e ->
    Logs.err (fun m ->
        m "Error executing command '%s': %s" full_command (Printexc.to_string e));
    -1

(** Truncate long paths to 50 chars with "..." prefix *)
let format_path path =
  if String.length path > 50 then
    "..." ^ String.sub path (String.length path - 47) 47
  else path
