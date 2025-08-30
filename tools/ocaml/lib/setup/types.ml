(** Setup types and data structures for MoneyWise CLI *)

type setup_result = {
  success : bool;
  errors : string list;
  warnings : string list;
  steps_completed : int;
  total_steps : int;
}
(** Setup result type for tracking success/failure across phases *)

type phase_result = {
  phase_name : string;
  success : bool;
  errors : string list;
  warnings : string list;
  details : string list;
}
(** Phase result type for individual phase outcomes *)
