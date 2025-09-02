(** Optimized error and warning handling functions for MoneyWise CLI setup *)

open Types

(** Standardized error message formatting helpers *)
let format_not_found item context = Fmt.str "%s not found%s" item context

let format_failed action reason = Fmt.str "%s failed: %s" action reason
let format_success action = Fmt.str "%s completed successfully" action

(** Mark phase as failed and add error message with consistent formatting *)
let add_phase_error phase_result error_msg =
  {
    phase_result with
    success = false;
    errors = error_msg :: phase_result.errors;
  }

(** Add warning message to phase result with consistent formatting *)
let add_phase_warning phase_result warning_msg =
  { phase_result with warnings = warning_msg :: phase_result.warnings }

(** Add detail message to phase result with consistent formatting *)
let add_detail phase_result detail_msg =
  { phase_result with details = detail_msg :: phase_result.details }
