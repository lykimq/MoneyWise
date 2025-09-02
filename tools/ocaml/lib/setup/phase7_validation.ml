(** Phase 7: Final Validation *)

open Types
open Utils
open Results
open Errors

(** Run final validation checks to verify everything is working *)
let final_validation root_dir =
  Logs.info (fun m -> m "🧪 Phase 7: Final Validation");
  let backend_dir = Filename.concat root_dir "moneywise-backend" in
  let frontend_dir = Filename.concat root_dir "moneywise-app" in

  (* Check backend and frontend accessibility using functional composition *)
  let result = initial_phase_result "Final Validation" in
  let result_after_backend =
    if directory_exists backend_dir then
      add_detail result "Backend directory accessible"
    else (
      Logs.err (fun m -> m "    ❌ Backend directory not accessible");
      add_phase_error result "Backend directory not accessible")
  in
  let result_after_frontend =
    if directory_exists frontend_dir then
      add_detail result_after_backend "Frontend directory accessible"
    else (
      Logs.err (fun m -> m "    ❌ Frontend directory not accessible");
      add_phase_error result_after_backend "Frontend directory not accessible")
  in
  (* Mark phase as completed if no critical errors *)
  if result_after_frontend.errors = [] then
    { result_after_frontend with success = true }
  else result_after_frontend
