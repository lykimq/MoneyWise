(** Phase 6: Service Management *)

open Types
open Utils
open Results
open Errors

(** Manage services by running the service manager script *)
let manage_services root_dir =
  Logs.info (fun m -> m "🔧 Phase 6: Service Management");
  let scripts_dir = Filename.concat root_dir "scripts" in
  let setup_dir = Filename.concat scripts_dir "setup" in
  let service_manager = Filename.concat setup_dir "service-manager.sh" in

  (* Check if service manager script exists using functional composition *)
  let result = initial_phase_result "Service Management" in
  if file_exists service_manager then
    let result_with_script = add_detail result "Service manager script found" in
    if make_executable service_manager then
      (* Execute service manager *)
      let exit_code = execute_command_in_dir setup_dir "./service-manager.sh" in
      if exit_code = 0 then
        let result_with_success =
          add_detail result_with_script "Services started successfully"
        in
        { result_with_success with success = true }
      else
        let result_with_warning =
          add_phase_warning result_with_script
            (Fmt.str "Service startup had issues (exit code: %d)" exit_code)
        in
        (* Still mark as completed since this is not critical *)
        { result_with_warning with success = true }
    else
      let result_with_warning =
        add_phase_warning result_with_script
          "Failed to make service manager executable"
      in
      (* Still mark as completed since this is not critical *)
      { result_with_warning with success = true }
  else
    let result_with_warning =
      add_phase_warning result "Service manager script not found"
    in
    (* Mark as completed since this is not critical *)
    { result_with_warning with success = true }
