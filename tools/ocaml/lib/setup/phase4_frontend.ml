(** Phase 4: Frontend Setup Note: This phase is not yet integrated into the main
    workflow. It will be called from the orchestrator in future updates. *)

open Types
open Utils
open Results
open Errors

(** Setup frontend by installing Node.js dependencies *)
let setup_frontend root_dir =
  Logs.info (fun m -> m "📱 Phase 4: Frontend Setup") ;
  let result = ref (initial_phase_result "Frontend Setup") in
  let frontend_dir = Filename.concat root_dir "moneywise-app" in
  let package_json = Filename.concat frontend_dir "package.json" in
  (* Verify package.json exists *)
  if not (file_exists package_json) then (
    Logs.err (fun m -> m "    ❌ Frontend package.json not found") ;
    Logs.warn (fun m ->
        m
          "    💡 This may be due to network issues or npm configuration \
           problems" ) ;
    Logs.warn (fun m ->
        m "    💡 Check your internet connection and npm registry settings" ) ;
    result := add_phase_error !result "Frontend package.json missing" ;
    result := {!result with success= false} )
  else (
    Logs.info (fun m -> m "    📦 Found frontend package configuration") ;
    result := add_detail !result "Frontend package.json found" ;
    (* Install Node.js dependencies *)
    Logs.info (fun m -> m "    📥 Installing frontend dependencies...") ;
    let exit_code = execute_command_in_dir frontend_dir "npm install" in
    if exit_code = 0 then (
      Logs.info (fun m ->
          m "    ✅ Frontend dependencies installed successfully" ) ;
      result :=
        add_detail !result "Frontend dependencies installed successfully" ;
      result := {!result with success= true} )
    else (
      Logs.err (fun m -> m "    ❌ Frontend dependency installation failed") ;
      Logs.warn (fun m ->
          m
            "    💡 This may be due to network issues or npm configuration \
             problems" ) ;
      Logs.warn (fun m ->
          m "    💡 Check your internet connection and npm registry settings" ) ;
      result :=
        add_phase_error !result "Frontend dependency installation failed" ;
      result := {!result with success= false} ) ) ;
  Logs.info (fun m ->
      m "  Phase 4 completed: %d/%d checks passed"
        (if !result.success then 1 else 0)
        1 ) ;
  !result
