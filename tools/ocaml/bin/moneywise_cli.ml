(** MoneyWise CLI - Main executable *)

open Cmdliner

(** Import the commands module *)
open Commands

(** Main command group *)
let cmds = [verify_cmd; test_cmd]

(** Workflow:
    1. verify - Verify project structure and prerequisites
    2. test   - Run project tests
*)

let () =
  Stdlib.exit @@ Cmd.eval (Cmd.group (Cmd.info "moneywise" ~version:"1.0.0") cmds)
