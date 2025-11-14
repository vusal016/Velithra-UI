/**
 * Velithra - Reusable Form Components
 * React Hook Form + Zod validation integration
 */

'use client';

import { useForm, Controller, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'switch'
    | 'date';
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  onSubmit: (data: T) => Promise<void> | void;
  defaultValues?: Partial<T>;
  fields: FormFieldConfig<T>[];
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

// ============================================
// MAIN FORM COMPONENT
// ============================================

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  fields,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false,
  className,
}: FormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const isLoading = loading || isSubmitting;

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <FormField
              field={field}
              controllerField={controllerField}
              error={errors[field.name]?.message as string}
              disabled={field.disabled || isLoading}
            />
          )}
        />
      ))}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}

// ============================================
// FORM FIELD COMPONENT
// ============================================

interface FormFieldProps<T extends FieldValues> {
  field: FormFieldConfig<T>;
  controllerField: any;
  error?: string;
  disabled?: boolean;
}

function FormField<T extends FieldValues>({
  field,
  controllerField,
  error,
  disabled,
}: FormFieldProps<T>) {
  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...controllerField}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={field.rows || 4}
            className={cn(error && 'border-destructive')}
          />
        );

      case 'select':
        return (
          <Select
            value={controllerField.value}
            onValueChange={controllerField.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={cn(error && 'border-destructive')}>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={controllerField.value}
              onCheckedChange={controllerField.onChange}
              disabled={disabled}
              id={field.name}
            />
            <Label htmlFor={field.name} className="cursor-pointer">
              {field.label}
            </Label>
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {field.description}
                </p>
              )}
            </div>
            <Switch
              checked={controllerField.value}
              onCheckedChange={controllerField.onChange}
              disabled={disabled}
              id={field.name}
            />
          </div>
        );

      case 'number':
        return (
          <Input
            {...controllerField}
            type="number"
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive')}
            onChange={(e) => controllerField.onChange(parseFloat(e.target.value))}
          />
        );

      case 'date':
        return (
          <Input
            {...controllerField}
            type="date"
            disabled={disabled}
            className={cn(error && 'border-destructive')}
          />
        );

      case 'password':
        return (
          <Input
            {...controllerField}
            type="password"
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive')}
            autoComplete="new-password"
          />
        );

      case 'email':
        return (
          <Input
            {...controllerField}
            type="email"
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive')}
            autoComplete="email"
          />
        );

      default:
        return (
          <Input
            {...controllerField}
            type="text"
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(error && 'border-destructive')}
          />
        );
    }
  };

  // Special rendering for checkbox and switch
  if (field.type === 'checkbox' || field.type === 'switch') {
    return (
      <div className={cn('space-y-2', field.className)}>
        {renderField()}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', field.className)}>
      <Label htmlFor={field.name}>
        {field.label}
        {field.description && (
          <span className="text-sm text-muted-foreground ml-2">
            ({field.description})
          </span>
        )}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
