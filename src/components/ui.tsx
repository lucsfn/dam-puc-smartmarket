import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { cores, raio } from '../theme';

// ---------- Button ----------
type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'default' | 'sm' | 'icon';

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const botaoVariantes: Record<ButtonVariant, { box: ViewStyle; text: TextStyle; pressed: ViewStyle }> = {
  default: {
    box: { backgroundColor: cores.primary },
    text: { color: cores.primaryForeground },
    pressed: { opacity: 0.85 },
  },
  secondary: {
    box: { backgroundColor: cores.secondary },
    text: { color: cores.secondaryForeground },
    pressed: { opacity: 0.8 },
  },
  outline: {
    box: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.input },
    text: { color: cores.foreground },
    pressed: { backgroundColor: cores.accent },
  },
  ghost: {
    box: { backgroundColor: 'transparent' },
    text: { color: cores.foreground },
    pressed: { backgroundColor: cores.accent },
  },
  destructive: {
    box: { backgroundColor: cores.destructiveBg, borderWidth: 1, borderColor: 'rgba(239,68,68,0.35)' },
    text: { color: cores.destructive },
    pressed: { opacity: 0.8 },
  },
  link: {
    box: { backgroundColor: 'transparent', paddingHorizontal: 0 },
    text: { color: cores.foreground, textDecorationLine: 'underline' },
    pressed: { opacity: 0.7 },
  },
};

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  loading,
  disabled,
  style,
}: ButtonProps) {
  const v = botaoVariantes[variant];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        s.botao,
        size === 'sm' && s.botaoSm,
        size === 'icon' && s.botaoIcon,
        v.box,
        pressed && v.pressed,
        off && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text.color as string} />
      ) : typeof children === 'string' ? (
        <Text style={[s.botaoTexto, size === 'sm' && { fontSize: 13 }, v.text]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

// ---------- Input ----------
export function Input({ style, onFocus, onBlur, ...rest }: TextInputProps) {
  const [foco, setFoco] = useState(false);
  return (
    <TextInput
      placeholderTextColor={cores.mutedForeground}
      selectionColor={cores.ring}
      {...rest}
      onFocus={(e) => {
        setFoco(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFoco(false);
        onBlur?.(e);
      }}
      style={[s.input, foco && s.inputFoco, style]}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

// ---------- Card ----------
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function CardHeader({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ padding: 20, paddingBottom: 12, gap: 4 }, style]}>{children}</View>;
}

export function CardTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.cardTitle, style]}>{children}</Text>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <Text style={s.cardDesc}>{children}</Text>;
}

export function CardContent({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ padding: 20, paddingTop: 8, gap: 12 }, style]}>{children}</View>;
}

// ---------- Alert / Badge / Separator ----------
export function Alerta({ children, tipo = 'erro' }: { children: React.ReactNode; tipo?: 'erro' | 'sucesso' }) {
  const ok = tipo === 'sucesso';
  return (
    <View
      style={[
        s.alerta,
        {
          backgroundColor: ok ? cores.successBg : cores.destructiveBg,
          borderColor: ok ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
        },
      ]}
    >
      <Text style={{ color: ok ? cores.success : cores.destructive, fontSize: 13 }}>{children}</Text>
    </View>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeTexto}>{children}</Text>
    </View>
  );
}

export function Separator() {
  return <View style={{ height: 1, backgroundColor: cores.border }} />;
}

export function Tela({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flex: 1, backgroundColor: cores.background, padding: 16 }, style]}>{children}</View>;
}

const s = StyleSheet.create({
  botao: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: raio.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  botaoSm: { height: 32, paddingHorizontal: 12, borderRadius: raio.md },
  botaoIcon: { height: 40, width: 40, paddingHorizontal: 0 },
  botaoTexto: { fontSize: 14, fontWeight: '500' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: cores.input,
    borderRadius: raio.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: cores.foreground,
    backgroundColor: 'transparent',
  },
  inputFoco: { borderColor: cores.ring },
  label: { fontSize: 13, fontWeight: '500', color: cores.foreground, marginBottom: -4 },
  card: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: raio.lg,
  },
  cardTitle: { fontSize: 22, fontWeight: '600', color: cores.foreground, letterSpacing: -0.3 },
  cardDesc: { fontSize: 14, color: cores.mutedForeground },
  alerta: { borderWidth: 1, borderRadius: raio.md, paddingHorizontal: 12, paddingVertical: 10 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeTexto: { fontSize: 12, fontWeight: '600', color: cores.foreground },
});
