import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, LucideIcon } from "lucide-react"

interface StepsProps {
  currentStep: number
  children: React.ReactNode
}

interface StepProps {
  title: string
  description?: string
  icon?: LucideIcon
  isActive?: boolean
  isCompleted?: boolean
}

const Steps = ({ currentStep, children }: StepsProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isActive: index === currentStep,
            isCompleted: index < currentStep,
            ...child.props
          })
        }
        return child
      })}
    </div>
  )
}

const Step = ({ title, description, icon: Icon, isActive, isCompleted }: StepProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 flex-1">
      <div className="flex items-center w-full">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : isActive
              ? "bg-blue-500 border-blue-500 text-white"
              : "bg-white border-gray-300 text-gray-500"
          )}
        >
          {isCompleted ? (
            <Check className="h-5 w-5" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">
              {/* Step number would go here if no icon */}
            </span>
          )}
        </div>
        
        {/* Connector line - don't show after last step */}
        <div className="flex-1 h-0.5 mx-4 bg-gray-200 last:hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              isCompleted ? "bg-green-500" : "bg-gray-200"
            )}
          />
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <h3
          className={cn(
            "text-sm font-medium transition-colors",
            isActive || isCompleted ? "text-gray-900" : "text-gray-500"
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "text-xs transition-colors",
              isActive || isCompleted ? "text-gray-600" : "text-gray-400"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export { Steps, Step }