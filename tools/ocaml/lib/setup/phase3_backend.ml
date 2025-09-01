(** Phase 3: Backend Setup *)

open Types
open Utils
open Results
open Errors

(** Setup backend by running the backend setup script *)
let setup_backend root_dir =
  Logs.info (fun m -> m "🚀 Phase 3: Backend Setup");
  let result = ref (initial_phase_result "Backend Setup") in
  (* Change to backend directory and run setup *)
  let backend_dir = Filename.concat root_dir "moneywise-backend" in
  let setup_script = Filename.concat backend_dir "setup.sh" in
  (* Verify setup script exists and is executable *)
  if not (file_exists setup_script) then (
    Logs.err (fun m -> m "    ❌ Backend setup script not found");
    result := add_phase_error !result "Backend setup script missing";
    result := { !result with success = false })
  else (
    Logs.info (fun m -> m "    📁 Found backend setup script");
    result := add_detail !result "Backend setup script found";
    (* Make script executable *)
    if make_executable setup_script then (
      Logs.info (fun m -> m "    🔧 Made setup script executable");
      result := add_detail !result "Setup script made executable";
      (* Execute backend setup *)
      Logs.info (fun m -> m "    🚀 Running backend setup...");
      let exit_code = execute_command_in_dir backend_dir "./setup.sh" in
      if exit_code = 0 then (
        Logs.info (fun m -> m "    ✅ Backend setup completed successfully");
        result := add_detail !result "Backend setup completed successfully";
        result := { !result with success = true })
      else (
        Logs.err (fun m ->
            m "    ❌ Backend setup failed with exit code %d" exit_code);
        result :=
          add_phase_error !result
            (Fmt.str "Backend setup failed (exit code: %d)" exit_code);
        result := { !result with success = false }))
    else (
      Logs.err (fun m -> m "    ❌ Failed to make setup script executable");
      result := add_phase_error !result "Failed to make setup script executable";
      result := { !result with success = false }));
  Logs.info (fun m ->
      m "  Phase 3 completed: %d/%d checks passed"
        (if !result.success then 1 else 0)
        1);
  !result
