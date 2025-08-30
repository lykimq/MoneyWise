(** MoneyWise CLI - Main executable *)

open Cmdliner
open Commands

type log_level = App | Info | Debug

(* Convert string to log_level *)
let log_level_of_string = function
  | "app" ->
      App
  | "info" ->
      Info
  | "debug" ->
      Debug
  | _ ->
      failwith "Invalid log level"

let log_level_term =
  let open Cmdliner in
  Arg.(
    value & opt string "info"
    & info ["log-level"] ~doc:"Set the log level (app, info, debug)" )

(** Sets up the logging infrastructure. *)
let setup_logs style_renderer level_str =
  let level = log_level_of_string level_str in
  Fmt_tty.setup_std_outputs ?style_renderer () ;
  match level with
  | App ->
      Logs.set_level (Some Logs.App)
  | Info ->
      Logs.set_level (Some Logs.Info)
  | Debug ->
      Logs.set_level (Some Logs.Debug)

(** Command-line term for setting the log level. *)
let setup_log =
  Term.(const setup_logs $ Fmt_cli.style_renderer () $ log_level_term)

(** Main command group *)
let cmds = [verify_cmd; test_cmd]

(** Workflow: 1. verify - Verify project structure and prerequisites 2. test -
    Run project tests *)
let main_cmd =
  let doc = "MoneyWise project management tools" in
  let info = Cmd.info "moneywise" ~version:"1.0.0" ~doc in
  let default = Term.(const ignore $ setup_log) in
  Cmd.group info ~default cmds

let () = exit (Cmd.eval main_cmd)
