(** Phase 4: Frontend Setup 
    Note: This phase is not yet integrated into the main workflow.
    It will be called from the orchestrator in future updates. *)

open Types
open Utils
open Results
open Errors

(** Setup frontend by installing Node.js dependencies *)
let setup_frontend root_dir =
  Printf.printf "📱 Phase 4: Frontend Setup\n";

  let result = ref (initial_phase_result "Frontend Setup") in

  let frontend_dir = Filename.concat root_dir "moneywise-app" in
  let package_json = Filename.concat frontend_dir "package.json" in

  (* Verify package.json exists *)
  if not (file_exists package_json) then (
    Printf.printf "    ❌ Frontend package.json not found\n";
    Printf.printf "    💡 This may be due to network issues or npm configuration problems\n";
    Printf.printf "    💡 Check your internet connection and npm registry settings\n";
          result := add_phase_error !result "Frontend package.json missing";
    result := { !result with success = false }
  ) else (
    Printf.printf "    📦 Found frontend package configuration\n";
    result := add_detail !result "Frontend package.json found";

    (* Install Node.js dependencies *)
    Printf.printf "    📥 Installing frontend dependencies...\n";
    let exit_code = execute_command_in_dir frontend_dir "npm install" in

    if exit_code = 0 then (
      Printf.printf "    ✅ Frontend dependencies installed successfully\n";
      result := add_detail !result "Frontend dependencies installed successfully";
      result := { !result with success = true }
    ) else (
      Printf.printf "    ❌ Frontend dependency installation failed\n";
      Printf.printf "    💡 This may be due to network issues or npm configuration problems\n";
      Printf.printf "    💡 Check your internet connection and npm registry settings\n";
              result := add_phase_error !result "Frontend dependency installation failed";
      result := { !result with success = false }
    )
  );

  Printf.printf "  Phase 4 completed: %d/%d checks passed\n"
    (if !result.success then 1 else 0) 1;

  !result
