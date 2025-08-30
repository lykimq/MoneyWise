(** MoneyWise CLI - Main executable *)

open Cmdliner
open Commands

(** Main command group *)
let cmds = [ verify_cmd; test_cmd ]

(** Workflow: 1. verify - Verify project structure and prerequisites 2. test -
    Run project tests *)
let main_cmd =
  let doc = "MoneyWise project management tools" in
  let info = Cmd.info "moneywise" ~version:"1.0.0" ~doc in
  Cmd.group info cmds

let () = exit (Cmd.eval main_cmd)
