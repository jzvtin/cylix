import { Label, RadioGroup, Text, clx } from "@modules/common/components/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (value: string) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-2.5">
      <Text className="font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink/40">
        {title}
      </Text>
      <RadioGroup data-testid={dataTestId} className="flex flex-col gap-y-1">
        {items?.map((i) => {
          const active = i.value === value
          return (
            <Label
              key={i.value}
              htmlFor={i.value}
              data-testid="radio-label"
              data-active={active}
              onClick={() => handleChange(i.value)}
              className={clx(
                "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold !transform-none transition-colors",
                active
                  ? "bg-gold-50 text-ink"
                  : "text-ink/55 hover:bg-ink/[0.03] hover:text-ink"
              )}
            >
              <span
                aria-hidden
                className={clx(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors",
                  active
                    ? "border-gold-500"
                    : "border-ink/25 group-hover:border-ink/40"
                )}
              >
                <span
                  className={clx(
                    "h-1.5 w-1.5 rounded-full transition-transform",
                    active ? "scale-100 bg-gold-500" : "scale-0 bg-transparent"
                  )}
                />
              </span>
              <RadioGroup.Item
                checked={active}
                onChange={() => handleChange(i.value)}
                className="hidden peer"
                id={i.value}
                value={i.value}
              />
              {i.label}
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
