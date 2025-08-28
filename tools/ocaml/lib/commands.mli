(** Commands module interface - exports all CLI commands *)

(** Setup command *)
val setup_cmd : unit Cmdliner.Cmd.t

(** Check command *)
val check_cmd : unit Cmdliner.Cmd.t

(** Test command *)
val test_cmd : unit Cmdliner.Cmd.t

(** Status command *)
val status_cmd : unit Cmdliner.Cmd.t
