(** Phase 3: Backend Setup *)

open Types
open Utils

(** Setup backend by running the backend setup script *)
let setup_backend root_dir =
  Printf.printf "🚀 Phase 3: Backend Setup\n";

  let result = ref (initial_phase_result "Backend Setup") in

  (* Change to backend directory and run setup *)
  let backend_dir = Filename.concat root_dir "moneywise-backend" in
  let setup_script = Filename.concat backend_dir "setup.sh" in

  (* Verify setup script exists and is executable *)
  if not (file_exists setup_script) then (
    Printf.printf "    ❌ Backend setup script not found\n";
  result := add_phase_error !result "Backend setup script missing";
  result := { !result with success = false }
  ) else (
    Printf.printf "    📁 Found backend setup script\n";
    result := add_detail !result "Backend setup script found";

    (* Make script executable *)
    if make_executable setup_script then (
      Printf.printf "    🔧 Made setup script executable\n";
      result := add_detail !result "Setup script made executable";

      (* Execute backend setup *)
      Printf.printf "    🚀 Running backend setup...\n";
      let exit_code = execute_command_in_dir backend_dir "./setup.sh" in

      if exit_code = 0 then (
        Printf.printf "    ✅ Backend setup completed successfully\n";
        result := add_detail !result "Backend setup completed successfully";
        result := { !result with success = true }
      ) else (
        Printf.printf "    ❌ Backend setup failed with exit code %d\n" exit_code;
        result := add_phase_error !result (Printf.sprintf "Backend setup failed (exit code: %d)" exit_code);
        result := { !result with success = false }
      )
    ) else (
      Printf.printf "    ❌ Failed to make setup script executable\n";
      result := add_phase_error !result "Failed to make setup script executable";
      result := { !result with success = false }
    )
  );

  Printf.printf "  Phase 3 completed: %d/%d checks passed\n"
    (if !result.success then 1 else 0) 1;

  !result
