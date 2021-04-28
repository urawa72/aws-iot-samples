import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EsRule from '../lib/es-rule-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EsRule.EsRuleStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
