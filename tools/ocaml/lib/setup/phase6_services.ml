(** Phase 6: Service Management *)

open Types
open Utils
open Results
open Errors

(** Manage services by running the service manager script *)
let manage_services root_dir =
  Logs.info (fun m -> m "🔧 Phase 6: Service Management") ;
  let result = ref (initial_phase_result "Service Management") in
  let scripts_dir = Filename.concat root_dir "scripts" in
  let setup_dir = Filename.concat scripts_dir "setup" in
  let service_manager = Filename.concat setup_dir "service-manager.sh" in
  (* Check if service manager script exists *)
  if file_exists service_manager then (
    Logs.info (fun m -> m "    🔧 Found service manager script") ;
    result := add_detail !result "Service manager script found" ;
    if make_executable service_manager then (
      Logs.info (fun m -> m "    🚀 Starting required services...") ;
      (* Execute service manager *)
      let exit_code = execute_command_in_dir setup_dir "./service-manager.sh" in
      if exit_code = 0 then (
        Logs.info (fun m -> m "    ✅ Services started successfully") ;
        result := add_detail !result "Services started successfully" ;
        result := {!result with success= true} )
      else (
        Logs.warn (fun m ->
            m "    ⚠️  Service startup had issues (exit code: %d)" exit_code ) ;
        result :=
          add_phase_warning !result
            (Fmt.str "Service startup had issues (exit code: %d)" exit_code) ;
        (* Still mark as completed since this is not critical *)
        result := {!result with success= true} ) )
    else (
      Logs.warn (fun m -> m "    ⚠️  Failed to make service manager executable") ;
      result :=
        add_phase_warning !result "Failed to make service manager executable" ;
      (* Still mark as completed since this is not critical *)
      result := {!result with success= true} ) )
  else (
    Logs.warn (fun m -> m "    ⚠️  Service manager script not found") ;
    Logs.info (fun m -> m "    💡 Services will need to be started manually") ;
    result := add_phase_warning !result "Service manager script not found" ;
    (* Mark as completed since this is not critical *)
    result := {!result with success= true} ) ;
  Logs.info (fun m ->
      m "  Phase 6 completed: %d/%d checks passed"
        (if !result.errors = [] then 1 else 0)
        1 ) ;
  !result
