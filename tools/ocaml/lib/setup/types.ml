(** Setup types and data structures for MoneyWise CLI *)

(** Setup result type for tracking success/failure across phases *)
type setup_result = {
  success : bool;
  errors : string list;
  warnings : string list;
  steps_completed : int;
  total_steps : int;
}

(** Phase result type for individual phase outcomes *)
type phase_result = {
  phase_name : string;
  success : bool;
  errors : string list;
  warnings : string list;
  details : string list;
}
