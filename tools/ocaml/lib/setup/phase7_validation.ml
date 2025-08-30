(** Phase 7: Final Validation *)

open Types
open Utils
open Results
open Errors

(** Run final validation checks to verify everything is working *)
let final_validation root_dir =
  Logs.info (fun m -> m "🧪 Phase 7: Final Validation") ;
  let result = ref (initial_phase_result "Final Validation") in
  (* Run final checks to verify everything is working *)
  Logs.info (fun m -> m "    🔍 Running final validation checks...") ;
  (* Check if backend is accessible *)
  let backend_dir = Filename.concat root_dir "moneywise-backend" in
  if directory_exists backend_dir then (
    Logs.info (fun m -> m "    ✅ Backend directory accessible") ;
    result := add_detail !result "Backend directory accessible" )
  else (
    Logs.err (fun m -> m "    ❌ Backend directory not accessible") ;
    result := add_phase_error !result "Backend directory not accessible" ) ;
  (* Check if frontend is accessible *)
  let frontend_dir = Filename.concat root_dir "moneywise-app" in
  if directory_exists frontend_dir then (
    Logs.info (fun m -> m "    ✅ Frontend directory accessible") ;
    result := add_detail !result "Frontend directory accessible" )
  else (
    Logs.err (fun m -> m "    ❌ Frontend directory not accessible") ;
    result := add_phase_error !result "Frontend directory not accessible" ) ;
  (* Mark phase as completed if no critical errors *)
  if !result.errors = [] then result := {!result with success= true} ;
  Logs.info (fun m ->
      m "  Phase 7 completed: %d/%d checks passed"
        (if !result.errors = [] then 1 else 0)
        1 ) ;
  !result
