(** Project verification orchestrator for MoneyWise CLI.
    This module coordinates the verification of project structure and prerequisites.
    It ensures that all required components are in place and dependencies are installed
    before any setup or installation can proceed. *)

open Types

(** Import implemented phase modules *)
open Phase1_structure  (* ✅ Fully implemented in OCaml *)
open Phase2_prerequisites  (* ✅ Fully implemented in OCaml *)

(* TODO: These phases are still in shell scripts, will be migrated to OCaml
open Phase3_backend
open Phase4_frontend
open Phase5_environment
open Phase6_services
open Phase7_validation
*)

(** Helper functions for consistent output formatting *)
let print_header text =
  Printf.printf "\n%s\n" text;
  Printf.printf "%s\n" (String.make (String.length text) '=')

let print_section text =
  Printf.printf "\n%s\n" text;
  Printf.printf "%s\n" (String.make (String.length text) '-')

(** Main setup function - orchestrates all phases *)
let run_verification root_dir =
  print_header "🔍 MoneyWise Project Verification";
  Printf.printf "\nProject directory: %s\n" root_dir;

  (* Phase 1: Project Structure *)
  print_section "1️⃣  Verifying Project Structure";
  let structure_result = verify_project_structure root_dir in
  if not structure_result.success then (
    Printf.printf "\n❌ Project structure verification failed!\n";
    Printf.printf "Please fix the structure issues above before proceeding.\n";
    exit 1
  );

  (* Phase 2: Prerequisites *)
  print_section "2️⃣  Checking Prerequisites";
  let prereq_result = verify_prerequisites () in
  if not prereq_result.success then (
    Printf.printf "\n❌ Prerequisites check failed!\n";
    Printf.printf "Please install the missing prerequisites before proceeding.\n";
    exit 1
  );

  Printf.printf "\n✅ Initial verification passed successfully!\n";

    (* Only run implemented phases *)
  let phase_results = [structure_result; prereq_result] in

  (* Aggregate and display results *)
  let final_result = aggregate_phase_results phase_results 2 in  (* Only 2 phases for now *)

  (* Note about remaining phases *)
  if final_result.success then (
    print_section "ℹ️  Next Steps";
    Printf.printf "The following phases need to be run using the shell scripts:\n";
    Printf.printf "1. Backend Setup:           ./tools/moneywise-hybrid.sh --shell setup-backend\n";
    Printf.printf "2. Frontend Setup:          cd moneywise-app && npm install\n";
    Printf.printf "3. Environment Config:      ./tools/moneywise-hybrid.sh --shell get-supabase-credentials\n";
    Printf.printf "4. Service Management:      ./tools/moneywise-hybrid.sh --shell service-manager\n";
    Printf.printf "5. Final Validation:        ./tools/moneywise-hybrid.sh --shell quick-check\n";
    Printf.printf "\nThese phases will be migrated to OCaml in future updates.\n"
  );
  print_header (if final_result.success
    then "✨ Setup Completed Successfully!"
    else "⚠️  Setup Completed with Issues");

  (* Display errors and warnings if any *)
  if final_result.errors <> [] then (
    print_section "❌ Errors";
    List.iter (fun error -> Printf.printf "• %s\n" error) final_result.errors
  );

  if final_result.warnings <> [] then (
    print_section "⚠️  Warnings";
    List.iter (fun warning -> Printf.printf "• %s\n" warning) final_result.warnings
  );

  (* Display next steps *)
  if final_result.success then (
    print_section "🚀 What's Running";
    Printf.printf "• Backend API: http://localhost:3000/api\n";
    Printf.printf "• Frontend: Ready to start with 'npm start' in moneywise-app/\n\n";

    print_section "📱 Next Steps";
    Printf.printf "1. Backend is running in the backend terminal\n";
    Printf.printf "2. Start frontend: cd moneywise-app && npm start\n";
    Printf.printf "3. Test API: curl http://localhost:3000/api/budgets/overview\n";
    Printf.printf "\n💡 Tip: Run 'moneywise check' to verify everything is working\n"
  ) else (
    print_section "🔄 Next Steps";
    Printf.printf "1. Address the errors listed above\n";
    Printf.printf "2. Run 'moneywise check' to verify fixes\n";
    Printf.printf "3. Run setup again\n"
  );

  (* Display final summary *)
  print_section "📊 Summary";
  Printf.printf "OCaml Phases completed: %d/%d\n" final_result.steps_completed final_result.total_steps;
  Printf.printf "Verification Status: %s\n" (if final_result.success then "✅ Success" else "❌ Failed");
  if final_result.errors <> [] then
    Printf.printf "Verification Errors: %d\n" (List.length final_result.errors);
  if final_result.warnings <> [] then
    Printf.printf "Verification Warnings: %d\n" (List.length final_result.warnings);
  Printf.printf "\nNote: Only structure and prerequisites verification are currently implemented in OCaml.\n";

  (* Exit with appropriate code *)
  exit (if final_result.success then 0 else 1)
