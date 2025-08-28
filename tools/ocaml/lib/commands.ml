(** Commands module - exports all CLI commands *)

(** Export all command functions directly from command modules *)
let setup_cmd = Setup_cmd.setup_cmd
let check_cmd = Check_cmd.check_cmd
let test_cmd = Test_cmd.test_cmd
let status_cmd = Status_cmd.status_cmd
