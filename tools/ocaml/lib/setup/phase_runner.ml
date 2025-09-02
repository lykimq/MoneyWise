(** Phase execution coordination for MoneyWise setup.

    This module coordinates the execution of all setup phases, handling the
    order of execution, result aggregation, and error handling. It provides a
    clean interface for running individual phases or the complete setup process.
*)

open Types
open Output

(** Execute all implemented phases in the correct order *)
let run_all_phases root_dir =
  (* Phase 1: Project Structure *)
  print_section "1️⃣  Verifying Project Structure";
  let structure_result = Phase1_structure.verify_project_structure root_dir in

  (* Phase 2: Prerequisites *)
  print_section "2️⃣  Checking Prerequisites";
  let prereq_result = Phase2_prerequisites.verify_prerequisites () in

  (* Phase 3: Frontend Setup *)
  print_section "3️⃣  Setting up Frontend";
  let frontend_result = Phase3_frontend.setup_frontend root_dir in

  (* Phase 4: Backend Setup *)
  print_section "4️⃣  Setting up Backend";
  let root_backend = Filename.concat root_dir "moneywise-backend" in
  let setup_backend_results =
    Phase4_backend_verification_steps.checks root_backend
  in

  (* Combine all phase results *)
  [ structure_result; prereq_result; frontend_result ] @ setup_backend_results

(** Execute phases and aggregate results *)
let execute_and_aggregate root_dir =
  let phase_results = run_all_phases root_dir in
  let final_result =
    Results.aggregate_phase_results phase_results (List.length phase_results)
  in
  final_result

(** Handle exceptions during phase execution *)
let handle_execution_exception exn =
  let msg = Printexc.to_string exn in
  Logs.err (fun m -> m "Unexpected exception: %s" msg);
  {
    Results.initial_result with
    success = false;
    errors = [ Fmt.str "Unexpected exception: %s" msg ];
    steps_completed = 0;
  }
