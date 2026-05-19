# Scenario: Finance App — Flutter

**Category:** Finance
**Framework:** Flutter
**Context level:** Medium — pubspec.yaml + colors.dart, no fastlane

## Simulated File Contents

### pubspec.yaml
```yaml
name: penny_wise
description: Track spending effortlessly. Know where every dollar goes.
version: 2.1.0+15
environment:
  sdk: ">=3.0.0 <4.0.0"
dependencies:
  flutter:
    sdk: flutter
```

### lib/theme/colors.dart
```dart
import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF2E7D32);
  static const primaryLight = Color(0xFFE8F5E9);
  static const background = Color(0xFFF5F5F5);
  static const surface = Color(0xFFFFFFFF);
  static const textPrimary = Color(0xFF212121);
  static const textSecondary = Color(0xFF757575);
  static const success = Color(0xFF43A047);
  static const danger = Color(0xFFE53935);
}
```

### README.md
```
# PennyWise

Stop wondering where your money went.

- Instant expense logging — 3 taps, done
- Smart categories that learn your spending patterns
- Weekly and monthly budget reports
- Subscription tracker to find forgotten charges
- Shared budgets for couples and families
```

No fastlane directory. No app icon found by scan commands.

## User Input

"I need a preview video for PennyWise."

## Expected Behavior

1. **Extraction:** Should find name from pubspec.yaml, description, and convert Flutter Color(0xFF...) format to hex strings
2. **Strategy:** Should read `strategies/finance.md`
3. **Color conversion:** `Color(0xFF2E7D32)` should become `#2E7D32`
4. **Arc:** Should recommend Problem-Solution-Proof (finance default)
5. **Copy quality:** Should use finance-specific language from strategy — "Where did it all go?" not generic "Track your data"
6. **Speed demo:** Should demonstrate expense logging (from README: "3 taps, done")
7. **Missing info:** Should ask for icon path, platform, and proof metrics
