(** Setup utilities for MoneyWise CLI *)

open Unix

(** Safe directory change with return to original *)
let safe_directory_operation target_dir operation =
  let original_dir = getcwd () in
  try
    chdir target_dir;
    let result = operation () in
    chdir original_dir;
    Ok result
  with e ->
    chdir original_dir;
    Error (Printexc.to_string e)

(** Check if file exists *)
let file_exists file_path =
  try
    let stats = stat file_path in
    stats.st_kind = S_REG
  with _ -> false

(** Check if directory exists *)
let directory_exists dir_path =
  try
    let stats = stat dir_path in
    stats.st_kind = S_DIR
  with _ -> false

(** Check if command is available in PATH *)
let command_exists cmd =
  try
    let _ = Sys.command ("which " ^ cmd ^ " >/dev/null 2>&1") in
    true
  with _ -> false

(** Make file executable *)
let make_executable file_path =
  try
    chmod file_path 0o755;
    true
  with _ -> false

(** Execute shell command and return exit code *)
let execute_command command =
  try
    Sys.command command
  with e ->
    Printf.printf "Error executing command '%s': %s\n" command (Printexc.to_string e);
    -1

(** Execute shell command in directory *)
let execute_command_in_dir dir command =
  let full_command = "cd " ^ dir ^ " && " ^ command in
  execute_command full_command

(** Format file path for display *)
let format_path path =
  if String.length path > 50 then
    "..." ^ String.sub path (String.length path - 47) 47
  else
    path
