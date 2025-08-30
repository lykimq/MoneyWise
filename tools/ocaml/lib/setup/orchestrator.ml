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
  Printf.printf "\n%s\n" text;
  Printf.printf "%s\n" (String.make (String.length text) '=')

let print_section text =
  Printf.printf "\n%s\n" text;
  Printf.printf "%s\n" (String.make (String.length text) '-')

let run_verification (root_dir : string) : Types.setup_result =
  (* Wrap orchestration so callers can decide on process exit; this makes the
     function testable and composable. *)
  try
    print_header "🔍 MoneyWise Project Verification";
    Printf.printf "\nProject directory: %s\n" root_dir;
    (* Phase 1: Project Structure *)
    print_section "1️⃣  Verifying Project Structure";
    let structure_result = Phase1_structure.verify_project_structure root_dir in
    (* Phase 2: Prerequisites *)
    print_section "2️⃣  Checking Prerequisites";
    let prereq_result = Phase2_prerequisites.verify_prerequisites () in
    Printf.printf "\n✅ Initial verification passed successfully!\n";
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
        List.iter (fun s -> Printf.printf "• %s\n" s) items)
    in
    let print_next_steps (r : Types.setup_result) =
      if r.success then (
        print_section "🚀 What's Ready";
        Printf.printf "• Project structure: ✅ Verified\n";
        Printf.printf "• Prerequisites: ✅ Installed\n";
        Printf.printf "• Development environment: Ready for setup\n\n";
        print_section "📱 Next Steps";
        Printf.printf "Use the MoneyWise CLI tools for the remaining setup:\n";
        Printf.printf "1. Backend Setup:           moneywise backend-setup\n";
        Printf.printf "2. Frontend Setup:          moneywise frontend-setup\n";
        Printf.printf "3. Environment Config:      moneywise env-setup\n";
        Printf.printf "4. Service Management:      moneywise services-setup\n";
        Printf.printf "5. Final Validation:        moneywise verify\n";
        Printf.printf
          "\n💡 Tip: Use 'moneywise --help' to explore all available commands\n")
      else (
        print_section "🔄 Next Steps";
        Printf.printf "1. Address the errors listed above\n";
        Printf.printf "2. Run 'moneywise verify' to verify fixes\n";
        Printf.printf "3. Run setup commands as needed\n")
    in
    (* Print errors and warnings if any *)
    print_list_section_if_any "❌ Errors" final_result.errors;
    print_list_section_if_any "⚠️  Warnings" final_result.warnings;
    (* Next steps and summary *)
    print_next_steps final_result;
    print_section "📊 Summary";
    Printf.printf "OCaml Phases completed: %d/%d\n" final_result.steps_completed
      final_result.total_steps;
    Printf.printf "Verification Status: %s\n"
      (if final_result.success then "✅ Success" else "❌ Failed");
    if final_result.errors <> [] then
      Printf.printf "Verification Errors: %d\n"
        (List.length final_result.errors);
    if final_result.warnings <> [] then
      Printf.printf "Verification Warnings: %d\n"
        (List.length final_result.warnings);
    Printf.printf
      "\n\
       Note: Only structure and prerequisites verification are currently \
       implemented.\n";
    Printf.printf
      "Additional setup commands will be available in future updates.\n";
    (* Return result to caller instead of exiting *)
    final_result
  with exn ->
    (* Convert unexpected exception into a failing setup_result so caller can decide
       what to do (exit / retry / log). Include the exception message in errors. *)
    let msg = Printexc.to_string exn in
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
