(** MoneyWise CLI - Main executable *)

open Cmdliner
open Commands

(** Set up logging reporter to display logs *)
let setup_logging () =
  (* Initialize Fmt_tty for proper terminal output *)
  Fmt_tty.setup_std_outputs ();
  (* Set up a basic console reporter that shows all log levels *)
  let reporter = Logs.format_reporter () in
  Logs.set_reporter reporter;
  (* Set default log level to info *)
  Logs.set_level (Some Logs.Info)

(** Main command group *)
let cmds = [ verify_cmd; test_cmd ]

(** Workflow: 1. verify - Verify project structure and prerequisites 2. test -
    Run project tests *)
let main_cmd =
  let doc = "MoneyWise project management tools" in
  let info = Cmd.info "moneywise" ~version:"1.0.0" ~doc in
  Cmd.group info cmds

let () =
  setup_logging ();
  exit (Cmd.eval main_cmd)
