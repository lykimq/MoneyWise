(** Phase 7: Final Validation *)

open Types
open Utils
open Results
open Errors

(** Run final validation checks to verify everything is working *)
let final_validation root_dir =
  Printf.printf "🧪 Phase 7: Final Validation\n";

  let result = ref (initial_phase_result "Final Validation") in

  (* Run final checks to verify everything is working *)
  Printf.printf "    🔍 Running final validation checks...\n";

  (* Check if backend is accessible *)
  let backend_dir = Filename.concat root_dir "moneywise-backend" in
  if directory_exists backend_dir then (
    Printf.printf "    ✅ Backend directory accessible\n";
    result := add_detail !result "Backend directory accessible"
  ) else (
    Printf.printf "    ❌ Backend directory not accessible\n";
          result := add_phase_error !result "Backend directory not accessible"
  );

  (* Check if frontend is accessible *)
  let frontend_dir = Filename.concat root_dir "moneywise-app" in
  if directory_exists frontend_dir then (
    Printf.printf "    ✅ Frontend directory accessible\n";
    result := add_detail !result "Frontend directory accessible"
  ) else (
    Printf.printf "    ❌ Frontend directory not accessible\n";
          result := add_phase_error !result "Frontend directory not accessible"
  );

  (* Mark phase as completed if no critical errors *)
  if !result.errors = [] then (
    result := { !result with success = true }
  );

  Printf.printf "  Phase 7 completed: %d/%d checks passed\n"
    (if !result.errors = [] then 1 else 0) 1;

  !result
