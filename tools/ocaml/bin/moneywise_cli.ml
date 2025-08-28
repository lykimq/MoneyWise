(** MoneyWise CLI - Main executable *)

open Cmdliner

(** Import the commands module *)
open Commands

(** CLI command definitions - now imported from modular structure *)

(** Main command group *)
let cmds = [setup_cmd; check_cmd; test_cmd; status_cmd]

(** Workflow:
    1. setup  - Creates and configures everything
    2. check  - Validates that setup was successful
    3. status - Ongoing monitoring
    4. test   - Comprehensive testing
*)

let () =
  Stdlib.exit @@ Cmd.eval (Cmd.group (Cmd.info "moneywise" ~version:"1.0.0") cmds)
