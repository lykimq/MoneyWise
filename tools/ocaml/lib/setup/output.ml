(** Output formatting and display logic for MoneyWise setup.

    This module handles all output formatting, display, and user guidance for
    the setup process. It provides consistent formatting across all phases and
    clear next steps for users. *)

open Types

(** Print a formatted title with the given character and text *)
let print_formatted_title char text =
  Logs.info (fun m -> m "");
  Logs.info (fun m -> m "%s" text);
  Logs.info (fun m -> m "%s" (String.make (String.length text) char))

(** Print a formatted header with the given text *)
let print_header = print_formatted_title '='

(** Print a formatted section with the given text *)
let print_section = print_formatted_title '-'

(** Print a list of items under a section title if the list is not empty *)
let print_list_section_if_any title items =
  if items <> [] then (
    print_section title;
    List.iter (fun s -> Logs.info (fun m -> m "• %s" s)) items)

(** Print next steps based on the verification result *)
let print_next_steps (r : setup_result) =
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

(** Print the final summary of the verification process *)
let print_summary (r : setup_result) =
  print_section "📊 Summary";
  Logs.info (fun m ->
      m "OCaml Phases completed: %d/%d" r.steps_completed r.total_steps);
  Logs.info (fun m ->
      m "Verification Status: %s"
        (if r.success then "✅ Success" else "❌ Failed"))

(** Print the main verification header *)
let print_verification_header root_dir =
  print_header "🔍 MoneyWise Project Verification";
  Logs.info (fun m -> m "Project directory: %s" root_dir)

(** Print the completion header based on success status *)
let print_completion_header success =
  print_header
    (if success then "✨ Verification Completed Successfully!"
     else "⚠️  Verification Completed with Issues")

(** Print all results (errors, warnings, next steps, summary) *)
let print_all_results (r : setup_result) =
  print_list_section_if_any "❌ Errors" r.errors;
  print_list_section_if_any "⚠️  Warnings" r.warnings;
  print_next_steps r;
  print_summary r
