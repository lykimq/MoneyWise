(** Commands module interface - exports all CLI commands *)

val verify_cmd : unit Cmdliner.Cmd.t
(** Project verification command *)

val test_cmd : unit Cmdliner.Cmd.t
(** Test command *)
