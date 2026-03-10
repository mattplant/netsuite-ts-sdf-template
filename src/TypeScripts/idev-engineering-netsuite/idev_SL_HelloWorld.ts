/**
 * iDev.Systems — Engineering NetSuite
 * https://github.com/mattplant/engineering-netsuite
 *
 * Copyright (c) 2021–2026 Matthew Plant
 * Licensed under the MIT License. See LICENSE for details.
 *
 * IDEV Hello World Suitelet
 *
 * Demonstrates the TypeScript → AMD JavaScript → SDF deploy pipeline.
 *
 * After deploying with `yarn deploy`, navigate to the Suitelet URL:
 *   https://<your-account-id>.app.netsuite.com/app/site/hosting/scriptlet.nl
 *     ?script=customscript_idev_sl_hello_world
 *     &deploy=customdeploy_idev_sl_hello_world
 *
 * Replace <your-account-id> with your NetSuite account ID.
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

import { EntryPoints } from 'N/types';
import * as serverWidget from 'N/ui/serverWidget';

export const onRequest: EntryPoints.Suitelet.onRequest = (
  context: EntryPoints.Suitelet.onRequestContext,
): void => {
  const form = serverWidget.createForm({ title: 'Hello World' });

  form.addField({
    id: 'custpage_message',
    type: serverWidget.FieldType.INLINEHTML,
    label: 'Message',
  }).defaultValue = `
    <div style="font-family: sans-serif; max-width: 640px; padding: 24px;">
      <h1 style="color: #2c5f8a;">🎉 Congratulations!</h1>
      <p style="font-size: 15px;">
        Your <strong>Engineering NetSuite</strong> TypeScript SDF project is up and running.
      </p>
      <p style="font-size: 15px;">
        This page was rendered by a Suitelet written in TypeScript, compiled to AMD JavaScript,
        and deployed to NetSuite via SDF — exactly as intended.
      </p>
      <p style="font-size: 15px;">
        You now have compile-time safety, real-time linting, infrastructure-as-code, and a
        Git-centered workflow powering your NetSuite development and deployment.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
      <p style="font-size: 13px; color: #888;">
        Built with the
        <a href="https://github.com/mattplant/engineering-netsuite" target="_blank" rel="noopener noreferrer"
           style="color: #2c5f8a;">Engineering NetSuite</a>
        methodology &mdash; modern software engineering rigor for NetSuite.
      </p>
    </div>
  `;

  context.response.writePage(form);
};
