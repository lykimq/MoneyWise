(** Result management functions for MoneyWise CLI setup *)

open Types

(** Create initial setup result with 7 total steps *)
let initial_result =
  {success= true; errors= []; warnings= []; steps_completed= 0; total_steps= 7}

(** Create initial phase result for given phase name *)
let initial_phase_result phase_name =
  {phase_name; success= true; errors= []; warnings= []; details= []}

(** Combine multiple phase results into single setup result *)
let aggregate_phase_results (phase_results : phase_result list)
    (total_phases : int) : setup_result =
  let aggregated =
    List.fold_left
      (fun (acc : setup_result) (phase_result : phase_result) ->
        { success= acc.success && phase_result.success
        ; errors= acc.errors @ phase_result.errors
        ; warnings= acc.warnings @ phase_result.warnings
        ; steps_completed=
            (acc.steps_completed + if phase_result.success then 1 else 0)
        ; total_steps= total_phases } )
      initial_result phase_results
  in
  aggregated

(** Map a setup_result to an exit code: 0 on success, non-zero on failure. *)
let exit_code (r : setup_result) : int = if r.success then 0 else 1
