import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface Props extends PropsWithChildren {
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  /** Bordas protegidas pela área segura. Telas com header nativo não precisam do topo. */
  edges?: Edge[];
}

export function ScreenContainer({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  edges = ['top', 'left', 'right'],
}: Props) {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, contentContainerStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
});
