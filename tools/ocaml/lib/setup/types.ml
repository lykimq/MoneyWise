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

(** Create initial setup result *)
let initial_result = {
  success = true;
  errors = [];
  warnings = [];
  steps_completed = 0;
  total_steps = 7;
}

(** Create initial phase result *)
let initial_phase_result phase_name = {
  phase_name;
  success = true;
  errors = [];
  warnings = [];
  details = [];
}

(** Add error to setup result *)
let add_error result error_msg =
  { result with
    success = false;
    errors = error_msg :: result.errors
  }

(** Add warning to setup result *)
let add_warning result warning_msg =
  { result with warnings = warning_msg :: result.warnings }

(** Add error to phase result *)
let add_phase_error phase_result error_msg =
  { phase_result with
    success = false;
    errors = error_msg :: phase_result.errors
  }

(** Add warning to phase result *)
let add_phase_warning phase_result warning_msg =
  { phase_result with warnings = warning_msg :: phase_result.warnings }

(** Add detail to phase result *)
let add_detail phase_result detail_msg =
  { phase_result with details = detail_msg :: phase_result.details }

(** Increment completed steps *)
let step_completed result =
  { result with steps_completed = result.steps_completed + 1 }

(** Convert phase result to setup result *)
let phase_to_setup_result phase_result =
  {
    success = phase_result.success;
    errors = phase_result.errors;
    warnings = phase_result.warnings;
    steps_completed = if phase_result.success then 1 else 0;
    total_steps = 1;
  }

(** Aggregate multiple phase results into a single setup result *)
let aggregate_phase_results (phase_results : phase_result list) (total_phases : int) : setup_result =
  let aggregated = List.fold_left (fun (acc : setup_result) (phase_result : phase_result) ->
    {
      success = acc.success && phase_result.success;
      errors = acc.errors @ phase_result.errors;
      warnings = acc.warnings @ phase_result.warnings;
      steps_completed = acc.steps_completed + (if phase_result.success then 1 else 0);
      total_steps = total_phases;
    }
  ) initial_result phase_results in

  aggregated
