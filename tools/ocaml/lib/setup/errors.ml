(** Error and warning handling functions for MoneyWise CLI setup *)

open Types

(** Mark phase as failed and add error message *)
let add_phase_error phase_result error_msg =
  { phase_result with
    success = false;
    errors = error_msg :: phase_result.errors
  }

(** Add warning message to phase result *)
let add_phase_warning phase_result warning_msg =
  { phase_result with warnings = warning_msg :: phase_result.warnings }

(** Add detail message to phase result *)
let add_detail phase_result detail_msg =
  { phase_result with details = detail_msg :: phase_result.details }
