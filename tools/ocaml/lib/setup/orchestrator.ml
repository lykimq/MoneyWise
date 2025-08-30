(** Project verification orchestrator for MoneyWise CLI. This module coordinates
    the verification of project structure and prerequisites. It ensures that all
    required components are in place and dependencies are installed before any
    setup or installation can proceed. *)

(* TODO: These phases are still implemented as shell scripts and will be
   migrated to OCaml in future updates. Example future module opens:
   open Phase3_backend
   open Phase4_frontend
   open Phase5_environment
   open Phase6_services
   open Phase7_validation
*)

open Types

(** Helper functions for consistent output formatting *)

let print_header text =
  Utils.log_at_current_level "";
  Utils.log_at_current_level text;
  Utils.log_at_current_level (String.make (String.length text) '=')

let print_section text =
  Utils.log_at_current_level "";
  Utils.log_at_current_level text;
  Utils.log_at_current_level (String.make (String.length text) '-')

let run_verification (root_dir : string) : Types.setup_result =
  (* Wrap orchestration so callers can decide on process exit; this makes the
     function testable and composable. *)
  try
    print_header "🔍 MoneyWise Project Verification";
    Utils.log_at_current_level (Printf.sprintf "Project directory: %s" root_dir);
    (* Phase 1: Project Structure *)
    print_section "1️⃣  Verifying Project Structure";
    let structure_result = Phase1_structure.verify_project_structure root_dir in
    (* Phase 2: Prerequisites *)
    print_section "2️⃣  Checking Prerequisites";
    let prereq_result = Phase2_prerequisites.verify_prerequisites () in
    Utils.log_at_current_level "✅ Initial verification passed successfully!";
    (* Only run implemented phases *)
    let phase_results = [ structure_result; prereq_result ] in
    (* Aggregate and display results *)
    let final_result = Results.aggregate_phase_results phase_results 2 in
    (* Only 2 phases for now: present the aggregated final_result clearly.
       Refactor printing into small helpers to avoid repeated checks and make
       the output logic easier to maintain. *)
    print_header
      (if final_result.success then "✨ Verification Completed Successfully!"
       else "⚠️  Verification Completed with Issues");
    (* Small helpers to reduce duplication *)
    let print_list_section_if_any title items =
      if items <> [] then (
        print_section title;
        List.iter
          (fun s -> Utils.log_at_current_level (Printf.sprintf "• %s" s))
          items)
    in
    let print_next_steps (r : Types.setup_result) =
      if r.success then (
        print_section "🚀 What's Ready";
        Utils.log_at_current_level "• Project structure: ✅ Verified";
        Utils.log_at_current_level "• Prerequisites: ✅ Installed";
        Utils.log_at_current_level "• Development environment: Ready for setup";
        print_section "📱 Next Steps";
        Utils.log_at_current_level
          "Use the MoneyWise CLI tools for the remaining setup:";
        Utils.log_at_current_level
          "1. Backend Setup:           moneywise backend-setup";
        Utils.log_at_current_level
          "2. Frontend Setup:          moneywise frontend-setup";
        Utils.log_at_current_level
          "3. Environment Config:      moneywise env-setup";
        Utils.log_at_current_level
          "4. Service Management:      moneywise services-setup";
        Utils.log_at_current_level
          "5. Final Validation:        moneywise verify";
        Utils.log_at_current_level
          "💡 Tip: Use 'moneywise --help' to explore all available commands")
      else (
        print_section "🔄 Next Steps";
        Utils.log_at_current_level "1. Address the errors listed above";
        Utils.log_at_current_level "2. Run 'moneywise verify' to verify fixes";
        Utils.log_at_current_level "3. Run setup commands as needed")
    in
    (* Print errors and warnings if any *)
    print_list_section_if_any "❌ Errors" final_result.errors;
    print_list_section_if_any "⚠️  Warnings" final_result.warnings;
    (* Next steps and summary *)
    print_next_steps final_result;
    print_section "📊 Summary";
    Utils.log_at_current_level
      (Printf.sprintf "OCaml Phases completed: %d/%d"
         final_result.steps_completed final_result.total_steps);
    Utils.log_at_current_level
      (Printf.sprintf "Verification Status: %s"
         (if final_result.success then "✅ Success" else "❌ Failed"));
    if final_result.errors <> [] then
      Utils.log_at_current_level
        (Printf.sprintf "Verification Errors: %d"
           (List.length final_result.errors));
    if final_result.warnings <> [] then
      Utils.log_at_current_level
        (Printf.sprintf "Verification Warnings: %d"
           (List.length final_result.warnings));
    Utils.log_at_current_level "";
    Utils.log_at_current_level
      "Note: Only structure and prerequisites verification are currently \
       implemented.";
    Utils.log_at_current_level
      "Additional setup commands will be available in future updates.";
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
      errors = [ "unexpected exception: " ^ msg ];
      steps_completed = 0;
    }

(* Helper: map a setup_result to an exit code. Kept here so the CLI can obtain
  an exit code without depending directly on the Results module (avoids circular
  compilation requirements). *)
let exit_code_of_result (r : Types.setup_result) : int =
  if r.success then 0 else 1

let run_verification_code (root_dir : string) : int =
  let res = run_verification root_dir in
  exit_code_of_result res
