(** MoneyWise CLI - Main executable *)

open Cmdliner

open Commands
(** Import the commands module *)

(** Main command group *)
let cmds = [ verify_cmd; test_cmd ]

(** Workflow: 1. verify - Verify project structure and prerequisites 2. test -
    Run project tests *)

let () =
  Stdlib.exit
  @@ Cmd.eval (Cmd.group (Cmd.info "moneywise" ~version:"1.0.0") cmds)
