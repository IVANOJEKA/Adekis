class HRRecord(Base):
    __tablename__ = "hr_records"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
