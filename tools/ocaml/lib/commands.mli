(** Commands module interface - exports all CLI commands *)

(** Project verification command *)
val verify_cmd : unit Cmdliner.Cmd.t

(** Test command *)
val test_cmd : unit Cmdliner.Cmd.t