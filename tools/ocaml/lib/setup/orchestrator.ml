(** Project verification orchestrator for MoneyWise CLI. This module coordinates
    the verification of project structure and prerequisites. It ensures that all
    required components are in place and dependencies are installed before any
    setup or installation can proceed. *)

(* TODO: These phases are still implemented as shell scripts and will be
   migrated to OCaml in future updates. Example future module opens:
   open Phase3_backend
   open Phase5_environment
   open Phase6_services
   open Phase7_validation
*)

(** Helper functions for consistent output formatting *)

let print_formatted_title char text =
  Logs.info (fun m -> m "");
  Logs.info (fun m -> m "%s" text);
  Logs.info (fun m -> m "%s" (String.make (String.length text) char))

let print_header = print_formatted_title '='
let print_section = print_formatted_title '-'

let run_verification (root_dir : string) : Types.setup_result =
  (* Wrap orchestration so callers can decide on process exit; this makes the
     function testable and composable. *)
  try
    print_header "🔍 MoneyWise Project Verification";
    Logs.info (fun m -> m "Project directory: %s" root_dir);
    (* Phase 1: Project Structure *)
    print_section "1️⃣  Verifying Project Structure";
    let structure_result = Phase1_structure.verify_project_structure root_dir in
    (* Phase 2: Prerequisites *)
    print_section "2️⃣  Checking Prerequisites";
    let prereq_result = Phase2_prerequisites.verify_prerequisites () in
    (* Phase 3: Frontend Setup *)
    print_section "3️⃣  Setting up Frontend";
    let frontend_result = Phase3_frontend.setup_frontend root_dir in
    (* Phase 4: Setup backend *)
    print_section "4️⃣  Setting up Backend";
    let root_backend = Filename.concat root_dir "moneywise-backend" in
    let setup_backend_results =
      Phase4_backend_verification_steps.checks root_backend
    in
    (* Only run implemented phases *)
    let phase_results =
      [ structure_result; prereq_result; frontend_result ]
      @ setup_backend_results
    in
    (* Aggregate and display results *)
    let final_result =
      Results.aggregate_phase_results phase_results (List.length phase_results)
    in
    print_header
      (if final_result.success then "✨ Verification Completed Successfully!"
       else "⚠️  Verification Completed with Issues");
    (* Small helpers to reduce duplication *)
    let print_list_section_if_any title items =
      if items <> [] then (
        print_section title;
        List.iter (fun s -> Logs.info (fun m -> m "• %s" s)) items)
    in
    let print_next_steps (r : Types.setup_result) =
      if r.success then (
        print_section "🚀 What's Ready";
        Logs.info (fun m -> m "• Project structure: ✅ Verified");
        Logs.info (fun m -> m "• Prerequisites: ✅ Installed");
        Logs.info (fun m -> m "• Frontend: ✅ Dependencies installed");
        Logs.info (fun m -> m "• Backend: ✅ Dependencies installed");
        Logs.info (fun m -> m "• Development environment: Ready for setup");
        print_section "📱 Next Steps";
        Logs.info (fun m ->
            m "Use the MoneyWise CLI tools for the remaining setup:");
        Logs.info (fun m ->
            m "1. Service Management:      moneywise services-setup");
        Logs.info (fun m -> m "2. Final Validation:        moneywise verify");
        Logs.info (fun m ->
            m "💡 Tip: Use 'moneywise --help' to explore all available commands"))
      else (
        print_section "🔄 Next Steps";
        Logs.info (fun m -> m "1. Address the errors listed above");
        Logs.info (fun m -> m "2. Run 'moneywise verify' to verify fixes");
        Logs.info (fun m -> m "3. Run setup commands as needed"))
    in
    (* Print errors and warnings if any *)
    print_list_section_if_any "❌ Errors" final_result.errors;
    print_list_section_if_any "⚠️  Warnings" final_result.warnings;
    (* Next steps and summary *)
    print_next_steps final_result;
    print_section "📊 Summary";
    Logs.info (fun m ->
        m "OCaml Phases completed: %d/%d" final_result.steps_completed
          final_result.total_steps);
    Logs.info (fun m ->
        m "Verification Status: %s"
          (if final_result.success then "✅ Success" else "❌ Failed"));
    (* Return result to caller instead of exiting *)
    final_result
  with exn ->
    (* Convert unexpected exception into a failing setup_result so caller can decide
       what to do (exit / retry / log). Include the exception message in errors. *)
    let msg = Printexc.to_string exn in
    Logs.err (fun m -> m "Unexpected exception: %s" msg);
    {
      Results.initial_result with
      success = false;
      errors = [ Fmt.str "Unexpected exception: %s" msg ];
      steps_completed = 0;
    }

let run_verification_code (root_dir : string) : int =
  let res = run_verification root_dir in
  Results.exit_code res
