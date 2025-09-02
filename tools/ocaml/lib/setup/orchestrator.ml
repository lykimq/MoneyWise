(** Project verification orchestrator for MoneyWise CLI.

    This module provides the main coordination interface for the setup system.
    It delegates phase execution to Phase_runner and output formatting to
    Output, maintaining a clean separation of concerns while providing a simple
    API. *)

open Types
open Output
open Phase_runner

(** Run the complete verification process.

    This function coordinates the entire setup verification process by: 1.
    Printing the verification header 2. Executing all phases through the phase
    runner 3. Displaying results through the output module 4. Returning the
    final aggregated result

    The function is designed to be testable and composable, allowing callers to
    decide on process exit behavior. *)
let run_verification (root_dir : string) : setup_result =
  try
    (* Print verification header *)
    print_verification_header root_dir;

    (* Execute all phases and get aggregated result *)
    let final_result = execute_and_aggregate root_dir in

    (* Display completion header *)
    print_completion_header final_result.success;

    (* Print all results (errors, warnings, next steps, summary) *)
    print_all_results final_result;

    (* Return result to caller *)
    final_result
  with exn ->
    (* Handle exceptions during execution *)
    handle_execution_exception exn

let run_verification_code (root_dir : string) : int =
  let res = run_verification root_dir in
  Results.exit_code res
