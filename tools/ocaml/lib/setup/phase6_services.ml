(** Phase 6: Service Management *)

open Types
open Utils
open Results
open Errors

(** Manage services by running the service manager script *)
let manage_services root_dir =
  Printf.printf "🔧 Phase 6: Service Management\n";

  let result = ref (initial_phase_result "Service Management") in

  let scripts_dir = Filename.concat root_dir "scripts" in
  let setup_dir = Filename.concat scripts_dir "setup" in
  let service_manager = Filename.concat setup_dir "service-manager.sh" in

  (* Check if service manager script exists *)
  if file_exists service_manager then (
    Printf.printf "    🔧 Found service manager script\n";
    result := add_detail !result "Service manager script found";

    if make_executable service_manager then (
      Printf.printf "    🚀 Starting required services...\n";

      (* Execute service manager *)
      let exit_code = execute_command_in_dir setup_dir "./service-manager.sh" in

      if exit_code = 0 then (
        Printf.printf "    ✅ Services started successfully\n";
        result := add_detail !result "Services started successfully";
        result := { !result with success = true }
      ) else (
        Printf.printf "    ⚠️  Service startup had issues (exit code: %d)\n" exit_code;
        result := add_phase_warning !result (Printf.sprintf "Service startup had issues (exit code: %d)" exit_code);
        (* Still mark as completed since this is not critical *)
        result := { !result with success = true }
      )
    ) else (
      Printf.printf "    ⚠️  Failed to make service manager executable\n";
      result := add_phase_warning !result "Failed to make service manager executable";
      (* Still mark as completed since this is not critical *)
      result := { !result with success = true }
    )
  ) else (
    Printf.printf "    ⚠️  Service manager script not found\n";
    Printf.printf "    💡 Services will need to be started manually\n";
    result := add_phase_warning !result "Service manager script not found";
    (* Mark as completed since this is not critical *)
    result := { !result with success = true }
  );

  Printf.printf "  Phase 6 completed: %d/%d checks passed\n"
    (if !result.errors = [] then 1 else 0) 1;

  !result
