let checks backend_dir =
  let step1_result = Phase4_backend_step1_checks.check backend_dir in
  let step2_result = Phase4_backend_step2_database_verify.check backend_dir in
  (* TODO: Add Step 3: Dependencies Installation *)
  (* TODO: Add Step 4: Configuration Validation *)
  [ step1_result; step2_result ]
