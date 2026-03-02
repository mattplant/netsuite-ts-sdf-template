/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

import { EntryPoints } from 'N/types';
import * as log from 'N/log';

/**
 * A high-integrity test script to verify the v2.0 modernization.
 */
export const beforeLoad: EntryPoints.UserEvent.beforeLoad = (
  context: EntryPoints.UserEvent.beforeLoadContext,
): void => {
  const { type, newRecord } = context;

  log.debug({
    title: 'Rigor Check',
    details: `Engine Running. Type: ${type} | ID: ${newRecord.id || 'New'}`,
  });
};
