export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type MilestonePeriod = '6_months' | '1_year' | '2_years'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          current_job_title: string | null
          current_salary: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          current_job_title?: string | null
          current_salary?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          current_job_title?: string | null
          current_salary?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_constraints: {
        Row: {
          id: string
          user_id: string
          monthly_expenses: number
          debt: number
          savings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monthly_expenses?: number
          debt?: number
          savings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          monthly_expenses?: number
          debt?: number
          savings?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_constraints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      career_goals: {
        Row: {
          id: string
          user_id: string
          target_industries: string[]
          desired_salary: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_industries?: string[]
          desired_salary?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_industries?: string[]
          desired_salary?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transition_plans: {
        Row: {
          id: string
          user_id: string
          period: MilestonePeriod
          milestones: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: MilestonePeriod
          milestones?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: MilestonePeriod
          milestones?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transition_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_assessments: {
        Row: {
          id: string
          user_id: string
          career_satisfaction: number | null
          burnout_level: number | null
          risk_tolerance: string | null
          financial_readiness: string | null
          timeline_preference: string | null
          family_situation: Json | null
          skills_gaps: string[] | null
          industry_interests: string[] | null
          motivation_factors: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          career_satisfaction?: number | null
          burnout_level?: number | null
          risk_tolerance?: string | null
          financial_readiness?: string | null
          timeline_preference?: string | null
          family_situation?: Json | null
          skills_gaps?: string[] | null
          industry_interests?: string[] | null
          motivation_factors?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          career_satisfaction?: number | null
          burnout_level?: number | null
          risk_tolerance?: string | null
          financial_readiness?: string | null
          timeline_preference?: string | null
          family_situation?: Json | null
          skills_gaps?: string[] | null
          industry_interests?: string[] | null
          motivation_factors?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      milestone_period: MilestonePeriod
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
