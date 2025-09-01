(** Log common suggestions for npm-related failures. *)
let log_npm_error_suggestions () =
  Logs.warn (fun m ->
      m "    💡 This may be due to network issues or npm configuration problems");
  Logs.warn (fun m ->
      m "    💡 Check your internet connection and npm registry settings")

(** Setup frontend by installing Node.js dependencies *)
let setup_frontend root_dir =
  Logs.info (fun m -> m "📱 Phase 4: Frontend Setup");
  let frontend_dir = Filename.concat root_dir "moneywise-app" in
  let package_json = Filename.concat frontend_dir "package.json" in
  let initial_result = Results.initial_phase_result "Frontend Setup" in

  (* 1. Verify package.json exists *)
  let result_after_check =
    if not (Utils.file_exists package_json) then (
      Logs.err (fun m -> m "    ❌ Frontend package.json not found");
      log_npm_error_suggestions ();
      Errors.add_phase_error initial_result "Frontend package.json missing"
      |> fun res -> { res with success = false })
    else (
      Logs.info (fun m -> m "    📦 Found frontend package configuration");
      Errors.add_detail initial_result "Frontend package.json found")
  in

  (* 2. Install dependencies if package.json was found *)
  let final_result =
    if result_after_check.success then (
      Logs.info (fun m -> m "    📥 Installing frontend dependencies...");
      let exit_code = Utils.execute_command_in_dir frontend_dir "npm install" in
      if exit_code = 0 then (
        Logs.info (fun m ->
            m "    ✅ Frontend dependencies installed successfully");
        Errors.add_detail result_after_check
          "Frontend dependencies installed successfully"
        |> fun res -> { res with success = true })
      else (
        Logs.err (fun m -> m "    ❌ Frontend dependency installation failed");
        log_npm_error_suggestions ();
        Errors.add_phase_error result_after_check
          "Frontend dependency installation failed"
        |> fun res -> { res with success = false }))
    else result_after_check
  in

  Logs.info (fun m ->
      m "  Phase 4 completed: %d/%d checks passed"
        (if final_result.success then 1 else 0)
        1);
  final_result
