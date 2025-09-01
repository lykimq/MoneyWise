(** MoneyWise CLI - Main executable *)

open Cmdliner
open Commands

(** Get the string representation of a log level for display *)
let get_log_level_string level =
  match level with
  | Logs.App -> "APP"
  | Logs.Info -> "INFO"
  | Logs.Warning -> "WARN"
  | Logs.Error -> "ERROR"
  | Logs.Debug -> "DEBUG"

(** Set up logging reporter to display logs *)
let setup_logging () =
  (* Initialize Fmt_tty for proper terminal output *)
  Fmt_tty.setup_std_outputs ();
  (* Create a custom reporter that shows log levels for all messages *)
  let reporter =
    let pp_header ppf (level, header) =
      let header_str = match header with Some s -> s | None -> "" in
      let level_str = get_log_level_string level in
      Fmt.pf ppf "[%s] %s" level_str header_str
    in
    Logs.format_reporter ~pp_header ()
  in
  Logs.set_reporter reporter

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
