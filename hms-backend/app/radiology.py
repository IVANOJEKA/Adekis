class RadiologyScan(Base):
    __tablename__ = "radiology_scans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
