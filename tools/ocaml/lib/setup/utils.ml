(** Setup utilities for MoneyWise CLI *)

open Unix

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

(** Copy file from source to destination *)
let copy_file src dest =
  try
  let ic = open_in src in
  let oc = open_out dest in
  let buffer_size = 8192 in
  let buffer = Bytes.create buffer_size in
  let rec copy () =
    let bytes_read = input ic buffer 0 buffer_size in
    if bytes_read > 0 then (
      output oc buffer 0 bytes_read;
      copy ()
    )
  in
  copy ();
  close_in ic;
  close_out oc;
  Ok ()
with
| Sys_error msg -> Error msg
| ex -> Error (Printexc.to_string ex)
