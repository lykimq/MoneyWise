(** Phase 3: Frontend Setup

    This phase handles the setup of the MoneyWise frontend application. It
    focuses on installing the required Node.js dependencies, which are essential
    for running, testing, and bundling the React Native application.

    The main steps are:
    - Locate the package.json file in the frontend directory
    - Run 'npm install' to download and install all dependencies
    - Report success or failure based on the outcome of the installation

    Proper dependency installation is critical for ensuring the application
    builds correctly and runs without runtime errors. *)

(** Log common suggestions for npm-related failures. When an `npm install`
    command fails, it can be due to a variety of environmental factors. This
    function provides common, actionable suggestions to the user to help them
    troubleshoot the problem. *)
let log_npm_error_suggestions () =
  Logs.warn (fun m ->
      m "    💡 This may be due to network issues or npm configuration problems");
  Logs.warn (fun m ->
      m "    💡 Check your internet connection and npm registry settings")

(** Setup frontend by installing Node.js dependencies. This is the main function
    for the frontend setup phase. It orchestrates the verification of
    package.json and the execution of 'npm install'. It takes the project root
    directory as input and returns a phase_result. *)
let setup_frontend root_dir =
  Logs.info (fun m -> m "📱 Phase 3: Frontend Setup");
  let frontend_dir = Filename.concat root_dir "moneywise-app" in
  let package_json = Filename.concat frontend_dir "package.json" in
  let initial_result = Results.initial_phase_result "Frontend Setup" in

  (* 1. Verify package.json exists *)
  let result_after_check =
    if not (Utils.file_exists package_json) then (
      Logs.err (fun m -> m "    ❌ Frontend package.json not found");
      log_npm_error_suggestions ();
      Errors.add_phase_error initial_result
        (Errors.format_not_found "Frontend package.json" ""))
    else Errors.add_detail initial_result "Frontend package.json found"
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
          (Errors.format_success "Frontend dependencies installation")
        |> fun res -> { res with success = true })
      else (
        Logs.err (fun m -> m "    ❌ Frontend dependency installation failed");
        log_npm_error_suggestions ();
        Errors.add_phase_error result_after_check
          (Errors.format_failed "Frontend dependency installation"
             "npm install command failed")))
    else result_after_check
  in

  final_result
